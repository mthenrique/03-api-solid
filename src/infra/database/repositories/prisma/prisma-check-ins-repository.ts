import { prisma } from "@/lib/prisma";
import { CheckInsRepository } from "../check-ins-repository";
import { ICheckInDTO } from "../dtos/check-ins/i-check-in-dto";
import { ICreateCheckInDTO } from "../dtos/check-ins/i-create-check-in-dto";

class PrismaCheckInsRepository implements CheckInsRepository {
  async create({userId, gymId, validatedAt}: ICreateCheckInDTO): Promise<ICheckInDTO> {
    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gymId,
        user_id: userId,
        validated_at: validatedAt
      }
    })

    return {
      id: checkIn.id,
      userId: checkIn.user_id,
      gymId: checkIn.gym_id,
      createdAt: checkIn.created_at
    }
  }

  async findByUserIdOnDate(userId: string, date: Date): Promise<ICheckInDTO | null> {
    const startOfTheDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay
        }
      }
    })

    if (!checkIn) {
      return null
    }

    return {
      id: checkIn?.id,
      gymId: checkIn?.gym_id,
      userId: checkIn?.user_id,
      createdAt: checkIn?.created_at
    }
  }
}

export default PrismaCheckInsRepository