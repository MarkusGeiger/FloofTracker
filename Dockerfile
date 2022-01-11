#  FROM mcr.microsoft.com/dotnet/aspnet:6.0
#  #FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine-arm64v8
#  COPY Server/FloofTracer/FloofTracer.NET6.React/bin/Release/net6.0/publish/ App/
#  WORKDIR /App
#  #ENTRYPOINT ["dotnet", "FloofTracer.NET6.React.dll"] 
#  CMD ASPNETCORE_URLS=http://*:$PORT dotnet FloofTracer.NET6.React.dll

FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y libpng-dev libjpeg-dev curl libxi6 build-essential libgl1-mesa-glx
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
WORKDIR /src
COPY ["Server/FloofTracer/FloofTracer.NET6.React/ReactSPA.csproj", "Server/FloofTracer/FloofTracer.NET6.React/"]
RUN dotnet restore "Server/FloofTracer/FloofTracer.NET6.React/FloofTracer.NET6.csproj"
COPY . .
WORKDIR "/src/Server/FloofTracer/FloofTracer.NET6.React"
RUN dotnet build "FloofTracer.NET6.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "FloofTracer.NET6.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FloofTracer.NET6.dll"]