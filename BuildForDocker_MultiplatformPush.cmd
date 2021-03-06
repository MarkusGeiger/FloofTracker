rem cd StatusWithoutIdentity
dotnet publish -c Release Server\FloofTracer\FloofTracer.NET6.React\FloofTracer.NET6.React.csproj
echo Dotnet Publish Result: %errorlevel%

rem docker buildx build -t markusgeiger/flooftracker --platform linux/amd64,linux/arm64 --push -f Dockerfile_Release Server\FloofTracer\FloofTracer.NET6.React
docker build -t markusgeiger/flooftracker .
echo Docker Build Result: %errorlevel%

rem docker stop statusdebug
rem docker rm statusdebug
rem docker run -d -p 8081:80 --name statusdebug statuswithoutidentity
rem echo Docker Restart Result: %errorlevel%