install:
	#docker run -v C:\Users\1013606332\app\colcomercio\ck-sitidata:/app -w /app -i -t node bash -c "npm install"

up:
	docker-compose up -d

down:
	docker-compose down

ps:
	docker-compose ps

start:
	docker-compose start

restart:
	docker-compose restart

stop:
	docker-compose stop

log:
	docker-compose logs -f

cli:
	docker-compose exec app bash

build:
	docker build -t registry.gitlab.com/alkosto/microservices/ck-sitidata:$(version).

push:
	docker login registry.gitlab.com
	docker push registry.gitlab.com/alkosto/microservices/ck-sitidata:$(version)
