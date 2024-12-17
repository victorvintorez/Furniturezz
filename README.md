# How to run!

1. Create a root .env file using the root .env.example file as a template.
2. Run the following command in your terminal at the root of the project:

```bash
docker compose --file compose.local.yaml --env-file .env up --build -d
```