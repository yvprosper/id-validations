# fluentd/Dockerfile
FROM fluent/fluentd:v0.12-debian
RUN ["gem", "install", "representable", "--no-rdoc", "--no-ri", "--version", "3.0.4"]
RUN ["gem", "install", "faraday", "--no-rdoc", "--no-ri", "--version", "0.17.4"]
RUN ["gem", "install", "fluent-plugin-elasticsearch", "--no-rdoc", "--no-ri", "--version", "1.9.2"]