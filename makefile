CSS = ./webmaker-nav/css/webmaker-nav.css
LESS = ./webmaker-nav/css/webmaker-nav.less
BADGE_CSS = ./webmaker-nav/css/badge-ui.css
BADGE_LESS = ./webmaker-nav/css/badge-ui.less

less:
	@echo "Compiling LESS: ${LESS}"
	@lessc ${LESS} > ${CSS}
	@echo "Compiling LESS: ${BADGE_LESS}"
	@lessc ${BADGE_LESS} > ${BADGE_CSS}
