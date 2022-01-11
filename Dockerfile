FROM mcr.microsoft.com/dotnet/aspnet:6.0
#FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine-arm64v8
COPY Server/FloofTracer/FloofTracer.NET6.React/bin/Release/net6.0/publish/ App/
WORKDIR /App
#ENTRYPOINT ["dotnet", "FloofTracer.NET6.React.dll"] 
CMD ASPNETCORE_URLS=http://*:$PORT dotnet FloofTracer.NET6.React.dll