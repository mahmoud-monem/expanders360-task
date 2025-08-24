import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { User } from "../user/entities/user.entity";
import { ClientService } from "./client.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Controller("clients")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Roles(UserRole.Admin)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @Roles(UserRole.Admin)
  findAll() {
    return this.clientService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  findOne(@Param("id") id: string, @CurrentUser() user: User) {
    // Clients can only view their own data - this would need additional logic
    // to link users to clients, for now allowing both roles
    return this.clientService.findOne(+id);
  }

  @Patch(":id")
  @Roles(UserRole.Admin)
  update(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  remove(@Param("id") id: string) {
    return this.clientService.remove(+id);
  }
}
