externals_dir = ../externals
profiler_dir = ..
underline = "==============================================="

all: npm-install build

git: git-profiler git-externals-express-profiler-axios git-externals-express-profiler-mongoose

git-profiler:
	@echo -e "express-profiler: GIT CLONE START\n$(underline)"
	@rm -rf $(profiler_dir)/express-profiler
	@cd $(profiler_dir) && git clone git@github.com:ghadautopia/express-profiler.git
	@echo -e "\nexpress-profiler: GIT CLONE DONE\n"

git-externals-%:
	@echo -e "$*: GIT CLONE START\n$(underline)"
	@mkdir -p $(externals_dir)
	@rm -rf $(externals_dir)/$*
	@cd $(externals_dir) && git clone git@github.com:ghadautopia/$*.git
	@echo -e "\n$*: GIT CLONE DONE\n"

npm-install: npm-install-profiler npm-install-externals-express-profiler-axios npm-install-externals-express-profiler-mongoose
	npm install
	
npm-install-profiler:
	@echo -e "express-profiler: NPM INSTALL START\n$(underline)"
	@cd $(profiler_dir)/express-profiler && npm i
	@echo -e "\nexpress-profiler: NPM INSTALL DONE\n"

npm-install-externals-%:
	@echo -e "$*: NPM INSTALL START\n$(underline)"
	@mkdir -p $(externals_dir)
	@cd $(externals_dir)/$* && npm i
	@echo -e "\n$*: NPM INSTALL DONE\n"

build: build-profiler build-externals-express-profiler-axios build-externals-express-profiler-mongoose
	npm run build
	
build-profiler:
	@echo -e "express-profiler: BUILD START\n$(underline)"
	@cd $(profiler_dir)/express-profiler && npm run build
	@echo -e "\nexpress-profiler: BUILD DONE\n"

build-externals-%:
	@echo -e "$*: BUILD START\n$(underline)"
	@mkdir -p $(externals_dir)
	@cd $(externals_dir)/$* && npm run build
	@echo -e "\n$*: BUILD DONE\n"
