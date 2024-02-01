import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      roles: undefined,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    const createdUser = await this.prisma.user.create({ data });

    const roles = await Promise.all(
      createUserDto.roles.map(async (role) => {
        const createdRole = await this.prisma.role.create({
          data: {
            userId: createdUser.id,
            name: role,
          },
        });

        return createdRole.name;
      }),
    );

    return {
      ...createdUser,
      roles,
      password: undefined,
    };
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async getRolesByUserId(userId: string) {
    const roles = await this.prisma.role.findMany({ where: { userId } });

    return roles.map((role) => role.name);
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
      roles: undefined,
      password: await bcrypt.hash(updateUserDto.password, 10),
    };

    if (updateUserDto.roles) {
      await this.prisma.role.deleteMany({
        where: { userId: updateUserDto.id },
      });

      const updatedRoles = await Promise.all(
        updateUserDto.roles.map(async (role) => {
          return await this.prisma.role.create({
            data: {
              userId: existingUser.id,
              name: role,
            },
          });
        }),
      );

      data.roles = {
        connect: updatedRoles.map((role) => ({ id: role.id })),
      };
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    return updatedUser;
  }

  async remove(id: string): Promise<any> {
    const existingUser = await this.findOne(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.role.deleteMany({
      where: { userId: id },
    });

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      id,
      message: `The user was successfully removed.`,
    };
  }
}
