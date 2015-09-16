Usage: beeper [opts] message

Options:

  -t <token>        Specifies the access_token to be sent in the request.
                    If unspecified, uses the environment variable
                    BEEPER_TOKEN. If that is also unspecified, the
                    default 'anonymous' token will be used.

  -h <host>         Specifies the host to which beeps will be sent. If
                    unspecified, uses the environment variable
                    BEEPER_HOST. If this is also unspecified an error
                    will be reported.

  -s <source>       Specifies the beep source. If unspecified, will
                    try the environment variable BEEPER_SOURCE. If
                    also unspecified, when using this CLI utility, the
                    default source is the machine name (as returned by
                    os.hostname()).

                    If the first character of the parameter value is a
                    slash character ('/'), then the source is set to that
                    value (minus the slash).

                    If the first character is NOT a slash, then it
                    is APPENDED to the hostname:

                    -s webserver      -> hostname/webserver
                    -s /jobsource     -> jobsource

