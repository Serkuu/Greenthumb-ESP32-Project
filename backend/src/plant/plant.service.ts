import { Injectable, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class PlantService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) { }
  async create(createPlantDto: CreatePlantDto, userId: number) {
    if (createPlantDto.gardenId) {
      const garden = await this.prisma.garden.findFirst({
        where: {
          id: createPlantDto.gardenId,
          userId: userId
        }
      });
      if (!garden) {
        throw new NotFoundException("Garden not found or access denied");
      }
    }
    return this.prisma.plant.create({
      data: {
        ...createPlantDto,
        userId
      }
    })
  }

  findAll(userId: number) {
    return this.prisma.plant.findMany({
      where: {
        userId
      }
    })
  }

  findOne(id: number, userId: number) {
    return this.prisma.plant.findFirst({
      where: {
        id,
        userId
      }
    });
  }

  async update(id: number, updatePlantDto: UpdatePlantDto, userId: number) {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id,
        userId
      }
    });
    if (!plant) {
      throw new NotFoundException("Plant not found or access denied");
    }
    return this.prisma.plant.update({
      where: {
        id
      },
      data: {
        ...updatePlantDto
      }
    });
  }

  async remove(id: number, userId: number) {
    const plant = await this.prisma.plant.findFirst({
      where: {
        id,
        userId
      }
    });
    if (!plant) {
      throw new NotFoundException("Plant not found or access denied");
    }
    return this.prisma.plant.delete({
      where: {
        id
      }
    });
  }

  async identifyPlant(base64Image: string) {
    const plantNetKey = this.configService.get('PLANTNET_API_KEY');
    const geminiKey = this.configService.get('GEMINI_API_KEY');

    if (!plantNetKey || !geminiKey) {
      throw new HttpException('Brak kluczy API w pliku .env', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      const blob = new Blob([buffer], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('images', blob, 'plant.jpg');
      formData.append('organs', 'leaf');

      const plantNetUrl = `https://my-api.plantnet.org/v2/identify/all?api-key=${plantNetKey}`;
      const plantNetRes = await fetch(plantNetUrl, { method: 'POST', body: formData });
      const plantNetData = await plantNetRes.json();

      if (!plantNetRes.ok) {
        throw new Error(plantNetData.message || 'Błąd API Pl@ntNet');
      }

      let speciesName = "Nieznana roślina";
      if (plantNetData.results && plantNetData.results.length > 0) {
        speciesName = plantNetData.results[0].species.scientificNameWithoutAuthor;
      } else {
        throw new Error('Pl@ntNet nie rozpoznał żadnej rośliny na tym zdjęciu.');
      }
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        }
      });

      const prompt = `
      Jesteś wybitnym botanikiem. Na podstawie zdjęcia rozpoznano następujący gatunek rośliny: ${speciesName}.
      Zwróć TYLKO czysty obiekt JSON (bez znaczników \`\`\`json i markdown) z następującymi polami:
      - plantName: (string) krótka polska nazwa potoczna
      - plantSpecies: (string) "${speciesName}"
      - plantDescription: (string) krótki opis pielęgnacji (2-3 zdania)
      - sunlightPreference: (string) enum [" jasne", "rozproszone światło", "półcień", "cień"]
      - wateringIntervalSummer: (number) liczba dni między podlewaniem latem (np. 5)
      - wateringIntervalWinter: (number) liczba dni między podlewaniem zimą (np. 14)
      - optimalMoistureLevel: (number) optymalna wilgotność gleby w % dla sensora (np. 40)
      - isToxicToPets: (boolean) wartość true lub false
      `;
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const plantMetadata = JSON.parse(text);

      return {
        ...plantMetadata,
        imageUrl: base64Image
      };

    } catch (error) {
      console.error(error);
      throw new HttpException(error.message || 'Błąd podczas identyfikacji rośliny', HttpStatus.BAD_REQUEST);
    }
  }
}
