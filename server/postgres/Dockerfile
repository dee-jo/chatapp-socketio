FROM postgres:latest
RUN mkdir -p /tmp/psql_data/

COPY chat_app_new1.sql /tmp/psql_data/
COPY ./init_docker_postgres.sh /docker-entrypoint-initdb.d/