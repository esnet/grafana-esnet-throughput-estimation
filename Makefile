NODE=/Users/seg/.nvm/versions/node/v14.17.6/bin/node
GRAFANA_PATH="node_modules/@grafana/toolkit/bin/grafana-toolkit.js"
BREW=/usr/local/bin/brew
CLI_TOOLS_PATH=~/work/cli-tools/stardust_map_topology
ROOT_URLS=change,me
LIB_DIR=src/lib

.PHONY: prod
prod:
	$(NODE) $(GRAFANA_PATH) "plugin:build"
	$(NODE) $(GRAFANA_PATH) "plugin:sign" "--rootUrls" $(ROOT_URLS)

.PHONY: dev
dev:
	$(NODE) $(GRAFANA_PATH) "plugin:dev"

.PHONY: libs
libs:
	cd $(LIB_DIR) && ln -s ../../node_modules/d3/dist/d3.min.js d3.min.js
	cd $(LIB_DIR) && ln -s ../../node_modules/d3-time-format/dist/d3-time-format.min.js d3-time-format.min.js
