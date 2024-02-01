import { Pool } from 'pg'

class Database {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: '',
            host: '',
            database: '',
            password: '',
            port: 5432
        });

        this.pool.on('error', (err) => {
            console.error("Erro de conexão com o PostgreSQL", err);
        });
    };

    query(text: string) {
        `DO $$
        DECLARE
            tenants VARCHAR[];
            tenant VARCHAR;
        BEGIN
        
            SET SCHEMA 'landlord';
        
            tenants := ARRAY(SELECT database_schema FROM landlord.v2_hotel WHERE database_schema NOT LIKE '%_demo' AND status = 0);
        
            FOREACH tenant IN ARRAY tenants LOOP
                BEGIN
                    EXECUTE 'SET SCHEMA '''|| tenant ||'''';
        
                    RAISE INFO 'found % at %', (SELECT value FROM hotel_config WHERE key = 'PricingRecommendationLock' LIMIT 1), tenant;
                    --RAISE INFO 'found % ', tenant;
        
                    --DELETE FROM FROM hotel_config WHERE key = 'PricingRecommendationLock' and 
        
                EXCEPTION
                    WHEN OTHERS THEN
                    RAISE WARNING 'Error in %', tenant;
                END;
        
            END LOOP;
        END $$;
        `
    }
}