# cityquery

This is the project repository for cityquery, an app which lets you visualize and query geographic building data such as cityJSON files. Contact Peter if you have trouble, and the sooner the better, so we can sort through setup issues, or anything I miss here.

## Structure

The project has:
- A postgresql Database
- Django (python) backend, found under django_env
- React js frontend found under ui

## To run once setup:
1. Use one terminal in cityquery\django_env `.\Scripts\activate` to activate the python environment.
2. Then `python manage.py runserver` to start the backend.
3. The Backend is now available at localhost:5000
4. In another terminal at cityquery/ui, run `yarn start`
5. The frontend is now available at localhost:3000

If you want to connect to the backend in a browser, go to localhost:5000/wel (REST api) or localhost:5000/admin (user account management)

## Setup

### Creating a PostgreSQL database
The hardest part of the project setup thus far is the database setup. It would probably be advantageous if we could find a remote hosting solution or make a setup script.

#### Download & Install

1. Download a PostGres installer from here: https://www.postgresql.org/download/.
When you install, please pay attention to:
- Install PostGIS addon when the extensions options come up
- Write down the login details for the default database admin/superuser account "postgres", you will need this for later, and its awkward to reset it.

2. Download this GIS binaries installer, when installing, you only need the GDAL module.
https://trac.osgeo.org/osgeo4w/

3. Make sure you have python installed, I got python 3.10 automatically from the ms store when I tried to use python on my powershell commandline.

4. Make sure you have npm installed

5. Clone this git repository

#### Creating the Database

1. In a terminal use the command `psql -U postgres` (where postgres is a username), enter that password you wrote down when prompted.
2. Once in postgres, run `CREATE DATABASE cityquery_db;`
3. You can (and should right now) connect to the database with `\c cityquery_db`
5. run `CREATE USER django WITH PASSWORD 'rvzJFcyWANkVxabZT4xnKSwH42jL2HE4';`, this is the user our backend will be using for now to connect to modify the database.
6. exit postgres with `\q`
7. Get your terminal to cityquery\django_env, and run `python manage.py makemigrations`, this should detect that changes need to be made to the database
8. Run `python manage.py migrate` This will tell django to create all the tables it needs in the database.
9. You're ready to run! Follow "To run once setup".
10. You can also interact with the database directly using "pgAdmin 4" which should have installed with postgres once you tell it how to connect to your database. 

