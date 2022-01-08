using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FloofTracer.NET6.React.Migrations
{
    public partial class SwitchPetEntityToPetId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Foods_Pets_PetId",
                table: "Foods");

            migrationBuilder.DropForeignKey(
                name: "FK_Weights_Pets_PetId",
                table: "Weights");

            migrationBuilder.DropIndex(
                name: "IX_Weights_PetId",
                table: "Weights");

            migrationBuilder.DropIndex(
                name: "IX_Foods_PetId",
                table: "Foods");

            migrationBuilder.AlterColumn<int>(
                name: "PetId",
                table: "Weights",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PetId",
                table: "Foods",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PetId",
                table: "Weights",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "PetId",
                table: "Foods",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.CreateIndex(
                name: "IX_Weights_PetId",
                table: "Weights",
                column: "PetId");

            migrationBuilder.CreateIndex(
                name: "IX_Foods_PetId",
                table: "Foods",
                column: "PetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Foods_Pets_PetId",
                table: "Foods",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Weights_Pets_PetId",
                table: "Weights",
                column: "PetId",
                principalTable: "Pets",
                principalColumn: "Id");
        }
    }
}
