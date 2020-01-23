-- begin SCR_FAVORITE_CAR
alter table SCR_FAVORITE_CAR add constraint FK_SCR_FAVORITE_CAR_CAR foreign key (CAR_ID) references SCR_CAR(ID)^
alter table SCR_FAVORITE_CAR add constraint FK_SCR_FAVORITE_CAR_USER foreign key (USER_ID) references SEC_USER(ID)^
create index IDX_SCR_FAVORITE_CAR_CAR on SCR_FAVORITE_CAR (CAR_ID)^
create index IDX_SCR_FAVORITE_CAR_USER on SCR_FAVORITE_CAR (USER_ID)^
-- end SCR_FAVORITE_CAR
-- begin SCR_CAR
alter table SCR_CAR add constraint FK_SCR_CAR_GARAGE foreign key (GARAGE_ID) references SCR_GARAGE(ID)^
alter table SCR_CAR add constraint FK_SCR_CAR_TECHNICAL_CERTIFICATE foreign key (TECHNICAL_CERTIFICATE_ID) references SCR_TECHNICAL_CERTIFICATE(ID)^
alter table SCR_CAR add constraint FK_SCR_CAR_PHOTO foreign key (PHOTO_ID) references SYS_FILE(ID)^
create index IDX_SCR_CAR_GARAGE on SCR_CAR (GARAGE_ID)^
create index IDX_SCR_CAR_PHOTO on SCR_CAR (PHOTO_ID)^
-- end SCR_CAR
-- begin SCR_CAR_RENT
alter table SCR_CAR_RENT add constraint FK_SCR_CAR_RENT_CAR foreign key (CAR_ID) references SCR_CAR(ID)^
create index IDX_SCR_CAR_RENT_CAR on SCR_CAR_RENT (CAR_ID)^
-- end SCR_CAR_RENT
-- begin SCR_SPARE_PART
alter table SCR_SPARE_PART add constraint FK_SCR_SPARE_PART_SPARE_PARTS foreign key (SPARE_PARTS_ID) references SCR_SPARE_PART(ID)^
alter table SCR_SPARE_PART add constraint FK_SCR_SPARE_PART_COMPOSITION_O2O foreign key (COMPOSITION_O2O_ID) references SCR_SPARE_PART_O2O(ID)^
create index IDX_SCR_SPARE_PART_SPARE_PARTS on SCR_SPARE_PART (SPARE_PARTS_ID)^
-- end SCR_SPARE_PART
-- begin SCR_SPARE_PART_O2M
alter table SCR_SPARE_PART_O2M add constraint FK_SCR_SPARE_PART_O2M_SPARE_PART foreign key (SPARE_PART_ID) references SCR_SPARE_PART(ID)^
create index IDX_SCR_SPARE_PART_O2M_SPARE_PART on SCR_SPARE_PART_O2M (SPARE_PART_ID)^
-- end SCR_SPARE_PART_O2M
