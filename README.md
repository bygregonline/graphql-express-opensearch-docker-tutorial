
![diagram](img/0_8hbC24tE4vpY72do.png)


---

This project demonstrates how to integrate Node.js (Express and Apollo/GraphQL) with OpenSearch using Docker containers.

---


## Container used on this project

- **OpenSearch**: A container running OpenSearch to provide a powerful, scalable search engine.
- **Node.js (Express)**: Provides RESTful APIs for querying data from OpenSearch.
- **Node.js (Apollo/GraphQL)**: Utilizes GraphQL for more flexible querying of OpenSearch data.
- **Python Data Loader**: Initializes OpenSearch with preloaded music data.
- **Simple Linux Container**: Provides access to file systems and logs for debugging purposes.
- **Docker Compose**: Orchestrates all the containers for seamless integration.

## Quick Start



```bash
gh repo clone bygregonline/graphql-express-opensearch-docker-tutorial
cd graphql-express-opensearch-docker-tutorial
docker bu
docker compose -p stack  up -d

```


## Extra

Use a simple linux container to read lod and opensearch file

```bash

docker exec -it simple-container /bin/bash

```


## Tear down service

```bash

docker compose down

```






-----





</br>
</br>



VOILA no milk needed



---

if you want to stop
docker compose down


---

SORRY I DON'T  REALLY KNOW HOW TO MAKE IT WORK ON WINDOWS AND I DON'T CARE TO INVESTIGATE IT.


🍺🍺🍺🍺 beerware software

------

 * "THE BEER-WARE LICENSE" (Revision 42):
 * <phk@FreeBSD.ORG> wrote this file.  As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return.   Poul-Henning Kamp

  ---