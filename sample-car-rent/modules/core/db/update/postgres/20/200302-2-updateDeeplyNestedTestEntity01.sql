alter table SCR_DEEPLY_NESTED_TEST_ENTITY add constraint FK_SCR_DEEPLY_NESTED_TEST_ENTITY_ASSOCIATION_O2_OATTR foreign key (ASSOCIATION_O2_OATTR_ID) references SCR_ASSOCIATION_O2O_TEST_ENTITY(ID);