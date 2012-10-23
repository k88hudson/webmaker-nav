CSS = ./webmaker-nav/css/webmaker-nav.less
LESS = ./webmaker-nav/css/webmaker-nav.css

less:
	@echo "Compiling LESS: ${LESS}"
	@lessc ${CSS} > ${LESS}
