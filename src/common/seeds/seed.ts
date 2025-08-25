import { NestFactory } from "@nestjs/core";
import { hash } from "bcrypt";
import { DataSource } from "typeorm";

import { AppModule } from "../../app.module";
import { Country } from "../../modules/country/entities/country.entity";
import { ProjectStatus } from "../../modules/project/constants/project-status.enum";
import { ServiceType } from "../../modules/project/constants/service-type.enum";
import { Project } from "../../modules/project/entities/project.entity";
import { UserRole } from "../../modules/user/constants/user-role.enum";
import { UserStatus } from "../../modules/user/constants/user-status.enum";
import { User } from "../../modules/user/entities/user.entity";
import { Vendor } from "../../modules/vendor/entities/vendor.entity";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log("Starting database seeding...");

  try {
    // Clear existing data (in reverse order due to foreign keys)
    await dataSource.query("DELETE FROM matches");
    await dataSource.query("DELETE FROM projects");
    await dataSource.query("DELETE FROM vendor_supported_countries");
    await dataSource.query("DELETE FROM vendors");
    await dataSource.query("DELETE FROM users");
    await dataSource.query("DELETE FROM countries");

    console.log("Cleared existing data");

    // Seed Countries
    const countries = [
      { name: "United States", code: "US", isoCode: "USA", longitude: "-95.7129", latitude: "37.0902" },
      { name: "United Kingdom", code: "GB", isoCode: "GBR", longitude: "-3.4360", latitude: "55.3781" },
      { name: "Germany", code: "DE", isoCode: "DEU", longitude: "10.4515", latitude: "51.1657" },
      { name: "France", code: "FR", isoCode: "FRA", longitude: "2.2137", latitude: "46.2276" },
      { name: "Canada", code: "CA", isoCode: "CAN", longitude: "-106.3468", latitude: "56.1304" },
      { name: "Australia", code: "AU", isoCode: "AUS", longitude: "133.7751", latitude: "-25.2744" },
      { name: "Japan", code: "JP", isoCode: "JPN", longitude: "138.2529", latitude: "36.2048" },
      { name: "Singapore", code: "SG", isoCode: "SGP", longitude: "103.8198", latitude: "1.3521" },
      { name: "Netherlands", code: "NL", isoCode: "NLD", longitude: "5.2913", latitude: "52.1326" },
      { name: "Switzerland", code: "CH", isoCode: "CHE", longitude: "8.2275", latitude: "46.8182" },
    ];

    const countryEntities: Country[] = [];
    for (const countryData of countries) {
      const country = dataSource.getRepository(Country).create(countryData);
      const savedCountry = await dataSource.getRepository(Country).save(country);
      countryEntities.push(savedCountry);
    }
    console.log(`Seeded ${countryEntities.length} countries`);

    // Seed Users
    const users = [
      { name: "Admin User", email: "admin@expanders360.com", password: "password123", role: UserRole.Admin },
      { name: "John Smith", email: "john.smith@techcorp.com", password: "password123", role: UserRole.Client },
      { name: "Sarah Johnson", email: "sarah.johnson@globalinc.com", password: "password123", role: UserRole.Client },
      { name: "Michael Brown", email: "michael.brown@innovate.com", password: "password123", role: UserRole.Client },
      { name: "Emily Davis", email: "emily.davis@startup.com", password: "password123", role: UserRole.Client },
      { name: "Robert Wilson", email: "robert.wilson@enterprise.com", password: "password123", role: UserRole.Client },
      { name: "Lisa Anderson", email: "lisa.anderson@consulting.com", password: "password123", role: UserRole.Client },
      { name: "David Miller", email: "david.miller@finance.com", password: "password123", role: UserRole.Client },
    ];

    const userEntities: User[] = [];
    for (const userData of users) {
      const hashedPassword = await hash(userData.password, 10);
      const user = dataSource.getRepository(User).create({
        ...userData,
        password: hashedPassword,
        status: UserStatus.Active,
      });
      const savedUser = await dataSource.getRepository(User).save(user);
      userEntities.push(savedUser);
    }
    console.log(`Seeded ${userEntities.length} users`);

    // Seed Vendors
    const vendors = [
      {
        name: "Global Legal Partners",
        offeredServices: [ServiceType.LegalServices, ServiceType.RegulatoryCompliance, ServiceType.BusinessSetup],
        rating: 4.8,
        responseSlaHours: 24,
        supportedCountries: [countryEntities[0], countryEntities[1], countryEntities[2]], // US, UK, Germany
      },
      {
        name: "Market Research Pro",
        offeredServices: [ServiceType.MarketResearch, ServiceType.Translation],
        rating: 4.5,
        responseSlaHours: 48,
        supportedCountries: [countryEntities[0], countryEntities[3], countryEntities[6]], // US, France, Japan
      },
      {
        name: "Tax Consulting Experts",
        offeredServices: [ServiceType.TaxConsulting, ServiceType.RegulatoryCompliance],
        rating: 4.7,
        responseSlaHours: 12,
        supportedCountries: [countryEntities[1], countryEntities[2], countryEntities[9]], // UK, Germany, Switzerland
      },
      {
        name: "Business Setup Solutions",
        offeredServices: [ServiceType.BusinessSetup, ServiceType.LocalPartnerships, ServiceType.OfficeSetup],
        rating: 4.2,
        responseSlaHours: 72,
        supportedCountries: [countryEntities[4], countryEntities[5], countryEntities[7]], // Canada, Australia, Singapore
      },
      {
        name: "Translation & Localization",
        offeredServices: [ServiceType.Translation, ServiceType.LocalPartnerships],
        rating: 4.6,
        responseSlaHours: 24,
        supportedCountries: [countryEntities[6], countryEntities[7], countryEntities[8]], // Japan, Singapore, Netherlands
      },
      {
        name: "Full Service Expansion",
        offeredServices: [
          ServiceType.MarketResearch,
          ServiceType.LegalServices,
          ServiceType.TaxConsulting,
          ServiceType.BusinessSetup,
          ServiceType.LocalPartnerships,
          ServiceType.RegulatoryCompliance,
        ],
        rating: 4.9,
        responseSlaHours: 6,
        supportedCountries: countryEntities, // All countries
      },
      {
        name: "Office Setup Specialists",
        offeredServices: [ServiceType.OfficeSetup, ServiceType.LocalPartnerships],
        rating: 4.1,
        responseSlaHours: 96,
        supportedCountries: [countryEntities[0], countryEntities[1], countryEntities[4]], // US, UK, Canada
      },
      {
        name: "Regulatory Compliance Co",
        offeredServices: [ServiceType.RegulatoryCompliance, ServiceType.LegalServices],
        rating: 4.4,
        responseSlaHours: 18,
        supportedCountries: [countryEntities[2], countryEntities[3], countryEntities[8], countryEntities[9]], // Germany, France, Netherlands, Switzerland
      },
    ];

    const vendorEntities: Vendor[] = [];
    for (const vendorData of vendors) {
      const vendor = dataSource.getRepository(Vendor).create(vendorData);
      const savedVendor = await dataSource.getRepository(Vendor).save(vendor);
      vendorEntities.push(savedVendor);
    }
    console.log(`Seeded ${vendorEntities.length} vendors`);

    // Seed Projects
    const projects = [
      {
        clientId: userEntities[1].id, // John Smith
        countryId: countryEntities[0].id, // US
        neededServices: [ServiceType.MarketResearch, ServiceType.LegalServices],
        budget: 50000.0,
        status: ProjectStatus.Active,
      },
      {
        clientId: userEntities[2].id, // Sarah Johnson
        countryId: countryEntities[1].id, // UK
        neededServices: [ServiceType.TaxConsulting, ServiceType.BusinessSetup],
        budget: 75000.0,
        status: ProjectStatus.Active,
      },
      {
        clientId: userEntities[3].id, // Michael Brown
        countryId: countryEntities[2].id, // Germany
        neededServices: [ServiceType.RegulatoryCompliance, ServiceType.OfficeSetup],
        budget: 100000.0,
        status: ProjectStatus.Pending,
      },
      {
        clientId: userEntities[4].id, // Emily Davis
        countryId: countryEntities[6].id, // Japan
        neededServices: [ServiceType.Translation, ServiceType.LocalPartnerships],
        budget: 30000.0,
        status: ProjectStatus.Active,
      },
      {
        clientId: userEntities[5].id, // Robert Wilson
        countryId: countryEntities[4].id, // Canada
        neededServices: [ServiceType.BusinessSetup, ServiceType.LocalPartnerships, ServiceType.OfficeSetup],
        budget: 120000.0,
        status: ProjectStatus.Active,
      },
      {
        clientId: userEntities[6].id, // Lisa Anderson
        countryId: countryEntities[7].id, // Singapore
        neededServices: [ServiceType.MarketResearch, ServiceType.RegulatoryCompliance],
        budget: 85000.0,
        status: ProjectStatus.Completed,
      },
      {
        clientId: userEntities[7].id, // David Miller
        countryId: countryEntities[9].id, // Switzerland
        neededServices: [ServiceType.TaxConsulting, ServiceType.LegalServices, ServiceType.RegulatoryCompliance],
        budget: 150000.0,
        status: ProjectStatus.Active,
      },
      {
        clientId: userEntities[1].id, // John Smith (second project)
        countryId: countryEntities[5].id, // Australia
        neededServices: [ServiceType.BusinessSetup, ServiceType.OfficeSetup],
        budget: 90000.0,
        status: ProjectStatus.Pending,
      },
    ];

    const projectEntities: Project[] = [];
    for (const projectData of projects) {
      const project = dataSource.getRepository(Project).create(projectData);
      const savedProject = await dataSource.getRepository(Project).save(project);
      projectEntities.push(savedProject);
    }
    console.log(`Seeded ${projectEntities.length} projects`);

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📊 Seeded Data Summary:");
    console.log(`- Countries: ${countryEntities.length}`);
    console.log(`- Users: ${userEntities.length} (1 admin, ${userEntities.length - 1} clients)`);
    console.log(`- Vendors: ${vendorEntities.length}`);
    console.log(`- Projects: ${projectEntities.length}`);
    console.log("\n🔑 Test Credentials:");
    console.log("Admin: admin@expanders360.com / password123");
    console.log("Client: john.smith@techcorp.com / password123");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await app.close();
  }
}

bootstrap();
