.PHONY: help dev dev-server dev-client install install-server install-client seed build start start-server start-client clean

# Run frontend (3001) and backend (5001) in parallel
dev:
	$(MAKE) -j2 dev-server dev-client

dev-server:
	cd server && npm run dev

dev-client:
	cd client && npm run dev

# Production start (build client first with `make build`)
start:
	$(MAKE) -j2 start-server start-client

start-server:
	cd server && npm start

start-client:
	cd client && npm run preview

install: install-server install-client

install-server:
	cd server && npm install

install-client:
	cd client && npm install

seed:
	cd server && npm run seed

build:
	cd client && npm run build

clean:
	rm -rf client/dist client/node_modules server/node_modules

help:
	@echo Mini CRM - Available commands:
	@echo   make install   Install server and client dependencies
	@echo   make seed      Seed database with admin and sample leads
	@echo   make dev       Run frontend :3001 and backend :5001 together
	@echo   make build     Build frontend for production
	@echo   make start     Run production server and preview together
	@echo   make clean     Remove node_modules and build output
