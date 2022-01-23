test:
	jest --config ./jest.config.js --maxWorkers=8 --detectOpenHandles

clean-module:
	@rm -rf ./node_modules

clean-build:
	@rm -rf ./.next

clean-docs:
	@rm -rf ./public/docs

clean: clean-module clean-build clean-docs

docs: clean-docs
	apidoc -i ./src/pages/ -o ./public/docs/ -t ./apidoc-template

build: docs
	next build
