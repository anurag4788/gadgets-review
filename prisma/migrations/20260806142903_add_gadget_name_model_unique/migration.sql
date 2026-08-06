/*
  Warnings:

  - A unique constraint covering the columns `[name,model]` on the table `Gadget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gadget_name_model_key" ON "Gadget"("name", "model");
