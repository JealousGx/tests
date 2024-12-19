import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import configuration from './config/configuration';
import { ContactsModule } from './modules/contacts/contacts.module';
import { LeasesModule } from './modules/leases/leases.module';
import { UnitsModule } from './modules/units/units.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    RouterModule.register([
      {
        path: 'v1',
        children: [
          { path: 'contacts', module: ContactsModule },
          { path: 'units', module: UnitsModule },
          { path: 'leases', module: LeasesModule },
        ],
      },
    ]),
    ContactsModule,
    UnitsModule,
    LeasesModule,
  ],
})
export class AppModule {}
