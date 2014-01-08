exports.config =
    files:
        javascripts:
            joinTo:
                'js/app.js': /^(vendor|bower_components|agnitio_modules|agnitio_lib|app)/

            order:
                after: ['bower_components/swag/lib/swag.js']

            pluginHelpers: 'js/app.js'

        stylesheets:
            joinTo:
                'css/app.css': /^(vendor|bower_components|agnitio_modules|agnitio_lib|app)/

        templates:
            joinTo: 'js/app.js'

    plugins:
        autoReload:
            enabled:
                js: on
                css: on
                assets: off

        imageoptimizer:
            path: 'images'
            smushit: no

        coffeelint:
            pattern: /^app\/.*\.coffee$/

            options:
                indentation:
                    value: 4
                    level: "warn"

                max_line_length:
                    level: "ignore"

    conventions:
        assets: /(assets|vendor\/assets|font)/
