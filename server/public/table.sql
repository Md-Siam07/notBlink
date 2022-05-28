drop table borrower;
drop table depositor;
drop table loan;
drop table account;
drop table customer;
drop table branch;

create table branch
( branch_name varchar2(15),
  branch_city   varchar2(30),
  assets          number(10,2),
  constraint branch_branch_name_pk primary key(branch_name));

create table customer
( customer_name varchar2(30),
  customer_street varchar2(15),
  customer_city   varchar2(15),
  constraint customer_customer_name_pk primary key (customer_name));

create table account
( account_number varchar2(15),
  branch_name     varchar2(15),
  balance            number(10,2),
  constraint account_account_number_pk primary key (account_number),
  constraint account_branch_name_fk foreign key(branch_name) references branch(branch_name));

create table loan
( loan_number varchar2(15),
  branch_name varchar2(15),
  amount        number(10,2),
  constraint loan_loan_number_pk primary key (loan_number),
  constraint loan_branch_name_fk foreign key(branch_name) references branch(branch_name));

create table depositor
( customer_name varchar2(30),
  account_number varchar2(15),
  constraint depositor_cust_name_acc_num_pk primary key(customer_name, account_number),
  constraint depositor_account_number_fk foreign key (account_number) references account(account_number),
  constraint depositor_customer_name_fk foreign key(customer_name) references customer(customer_name));

create table borrower
( customer_name varchar2(30),
  loan_number    varchar2(15),
  constraint borrower_cust_name_loan_num_pk primary key(customer_name,loan_number),
  constraint borrower_loan_number_fk foreign key(loan_number) references loan(loan_number),
  constraint borrower_customer_name_fk foreign key(customer_name) references customer(customer_name));

insert into branch(branch_name, branch_city, assets)
with names as
(select 'Brighton','Brooklyn',7100000 from dual union all
select 'Downtown', 'Brooklyn',9000000 from dual union all
select 'Mianus', 'Horseneck', 400000 from dual union all
select 'North Town', 'Rye', 3700000 from dual union all
select 'Perryridge', 'Horseneck', 1700000 from dual union all
select 'Pownal', 'Bennington', 300000 from dual union all
select 'Redwood','Palo Alto', 2100000 from dual union all
select 'Round Hill', 'Horseneck', 8000000 from dual)
select * from names;

insert into customer(customer_name, customer_street, customer_city)
with names as
(select 'Adams','Spring','Pittsfield' from dual union all
select 'Brooks','Senator','Brooklyn' from dual union all
select 'Curry','North','Rye' from dual union all
select 'Glenn','Sand Hill','Woodside' from dual union all
select 'Green','Walnut','Stamford' from dual union all
select 'Hayes','Main','Harrison' from dual union all
select 'Johnson','Alma','Palo Alto' from dual union all
select 'Jones','Main','Harrison' from dual union all
select 'Lindsay','Park','Pittsfield' from dual union all
select 'Smith','North','Rye' from dual union all
select 'Turner','Putnam','Stamford' from dual union all
select 'Williams','Nassau','Princeton' from dual)
select * from names;

insert into account ( account_number, branch_name, balance)
with names as
(select 'A-101','Downtown', 500 from dual union all
select 'A-102','Perryridge', 400 from dual union all
select 'A-201','Brighton', 900 from dual union all
select 'A-215','Mianus', 700 from dual union all
select 'A-217','Brighton', 750 from dual union all
select 'A-222','Redwood', 700 from dual union all
select 'A-305','Round Hill', 350 from dual)
select * from names;

insert into loan ( loan_number, branch_name, amount)
with names as
(select 'L-11', 'Round Hill', 900 from dual union all
select 'L-14', 'Downtown', 1500 from dual union all
select 'L-15', 'Perryridge', 1500 from dual union all
select 'L-16', 'Perryridge', 1300 from dual union all
select 'L-17', 'Downtown', 1000 from dual union all
select 'L-23', 'Redwood', 2000 from dual union all
select 'L-93', 'Mianus', 500 from dual)
select * from names;

insert into depositor( customer_name, account_number)
with names as
(select 'Hayes', 'A-102' from dual union all
select 'Johnson', 'A-101' from dual union all
select 'Johnson', 'A-201' from dual union all
select 'Jones', 'A-217' from dual union all
select 'Lindsay', 'A-222' from dual union all
select 'Smith', 'A-215' from dual union all
select 'Turner', 'A-305' from dual )
select * from names;

insert into borrower( customer_name, loan_number)
with names as
(select 'Adams', 'L-16' from dual union all
select 'Curry', 'L-93' from dual union all
select 'Hayes', 'L-15' from dual union all
select 'Johnson', 'L-14' from dual union all
select 'Jones', 'L-17' from dual union all
select 'Smith', 'L-11' from dual union all
select 'Smith', 'L-23' from dual union all
select 'Williams', 'L-17' from dual)
select * from names;