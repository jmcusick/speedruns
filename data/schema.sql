-- to run: mysql -u sdd -h 67.87.193.87 -p srl < schema.sql

drop table if exists creds;

create table creds ( 
  email         varchar(255) primary key
  , hash        varchar(125)
);
