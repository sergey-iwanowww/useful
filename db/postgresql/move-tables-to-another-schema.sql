DO
$$
    DECLARE
        tbl record;
    BEGIN
        FOR tbl IN
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              and table_type = 'BASE TABLE'
              and table_name not in ('spatial_ref_sys')
            LOOP
                EXECUTE format('ALTER TABLE public.%I SET SCHEMA sport;', tbl.table_name);
            END LOOP;
    END;
$$
LANGUAGE plpgsql;