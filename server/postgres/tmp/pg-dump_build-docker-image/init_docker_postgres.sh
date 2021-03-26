#!/bin/bash

DB_DUMP_LOCATION="/tmp/psql_data/chat_app_new1.sql"

echo "*** CREATING DATABASE ***"

psql -U postgres -d chat < "$DB_DUMP_LOCATION";

echo "*** DATABASE CREATED! ***"