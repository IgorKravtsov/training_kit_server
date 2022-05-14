import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { getPostgresConfig } from './postgres.config'

export const getTypeormConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    ...getPostgresConfig(configService),
    type: 'postgres',
    // entities: [__dirname + '/*/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: true,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  }
}
