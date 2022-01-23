clean-module:
	@rm -rf ./node_modules

clean-build:
	@rm -rf ./.next

clean: clean-module clean-build

