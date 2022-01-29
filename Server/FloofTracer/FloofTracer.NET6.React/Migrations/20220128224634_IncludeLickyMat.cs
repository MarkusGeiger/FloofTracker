using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FloofTracer.NET6.React.Migrations
{
    public partial class IncludeLickyMat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "LickyMat",
                table: "Foods",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LickyMat",
                table: "Foods");
        }
    }
}
