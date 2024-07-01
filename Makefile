# SPDX-FileCopyrightText: 2018 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
app_name=$(notdir $(CURDIR))
project_directory=$(CURDIR)/../$(app_name)
build_tools_directory=$(CURDIR)/build/tools
source_build_directory=$(CURDIR)/build/artifacts/source
source_package_name=$(source_build_directory)/$(app_name)
appstore_build_directory=$(CURDIR)/build/artifacts/appstore
appstore_package_name=$(appstore_build_directory)/$(app_name)
sign_dir=$(appstore_build_directory)/sign
cert_dir=$(HOME)/.nextcloud/certificates

all: dev-setup lint stylelint cslint build-js-production

# Dev env management
dev-setup: clean clean-dev install-npm-deps-dev install-composer-deps-dev

npm-update:
	npm update

composer.phar:
	curl -sS https://getcomposer.org/installer | php

install-deps: install-composer-deps-dev install-npm-deps-dev

install-npm-deps-dev:
	npm ci

install-composer-deps: composer.phar
	php composer.phar install --no-dev -o

install-composer-deps-dev: composer.phar
	php composer.phar install -o

# Building
build-js:
	npm run dev

build-js-production:
	npm run build

watch-js:
	npm run watch

# Linting
lint:
	npm run lint

lint-fix:
	npm run lint:fix

# Style linting
stylelint:
	npm run stylelint

stylelint-fix:
	npm run stylelint:fix

# Php linting
cslint:
	composer run cs:check

cslint-fix:
	composer run cs:fix

# Cleaning
clean:
	rm -rf js

clean-dev:
	rm -rf node_modules
	rm -rf vendor

appstore:
	rm -rf $(appstore_build_directory)
	mkdir -p $(appstore_build_directory)
	mkdir -p $(sign_dir)
	tar cvzf $(appstore_package_name).tar.gz \
	--exclude-vcs \
	$(project_directory)/appinfo \
	$(project_directory)/css \
	$(project_directory)/img \
	$(project_directory)/js \
	$(project_directory)/lib \
	$(project_directory)/templates

