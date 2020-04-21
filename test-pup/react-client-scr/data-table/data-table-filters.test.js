const {login} = require("../../common/login-to-scr");
const puppeteer = require("puppeteer");

describe('DataTable - filters', () => {
  let page;

  const tableNotEmptySelector = '.ant-table-tbody:not(:empty)';

  /**
   *
   * @returns {!Promise<!Object|undefined>} a promise that resolves into a 2D array
   * (array of rows, row is an array of cells).
   * To get a cell use `table[rowIndex][columnIndex]`.
   */
  const readTable = async () => {
    return page.$$eval('.ant-table-tbody > tr', rows => {
      return rows.map(row => {
        const cells = [...row.getElementsByTagName('td')].slice(1); // Slice away the selection column.
        return cells.map(cell => {
          return cell.innerHTML;
        });
      });
    });
  };

  const openFilter = async (columnIndex) => {
    const filterSelector = `.ant-table-thead > tr > th:nth-child(${columnIndex + 2}) > i`;
    await page.click(filterSelector);
    await page.waitForSelector('.ant-dropdown:not(.ant-dropdown-hidden)');
  };

  const typeTextIntoInput = async (selector, text) => {
    await page.waitForSelector(selector);
    // Select the existing text (if any).
    await page.click(selector, {clickCount: 3})
    // Type the new text. This will clear the existing text.
    await page.type(selector, text);
  };

  const setInputValue = async (attr, value) => {
    const inputSelector = `#${attr}_input`;
    await typeTextIntoInput(inputSelector, value);
  };

  const setSelectValue = async (attr, value) => {
    const inputSelector = `#${attr}_input`;
    // Open the dropdown.
    await page.click(inputSelector);
    const dropdownSelector = `.cuba-value-dropdown-${attr}`;
    const optionClassName = `cuba-filter-value-${value}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await page.waitForSelector(optionSelector);
    // Select the option.
    await page.click(optionSelector);
    await page.waitForSelector(`.cuba-value-dropdown-${attr}.ant-select-dropdown-hidden`);
  };

  const setOperator = async (attr, operator) => {
    await page.click(`#${attr}_operatorsDropdown`); // Opens dropdown.
    const dropdownSelector = `.cuba-operator-dropdown-${attr}`;
    const optionClassName = `cuba-operator-${operator}`;
    const optionSelector = `${dropdownSelector} .${optionClassName}`;
    await page.waitForSelector(optionSelector);
    await page.click(optionSelector);
    await page.waitForSelector(`.cuba-operator-dropdown-${attr}.ant-select-dropdown-hidden`);
  };

  const addListItem = async (attr, value) => {
    await page.waitForSelector('.cuba-list-editor-input');
    await page.click('.cuba-list-editor-input');
    const listInputSelector = '.filtercontrol.-complex-editor input';
    await typeTextIntoInput(listInputSelector, value);
    await page.keyboard.press('Enter');
    await page.waitForSelector('.cuba-list-editor-input'); // Wait until "+ Add Item" button appears again.
  };

  const applyFilter = async () => {
    const submitBtnSelector = '.ant-dropdown:not(.ant-dropdown-hidden) .cuba-table-filter > .footer > button[type="submit"]';
    await page.click(submitBtnSelector);
    await page.waitForSelector('.ant-spin'); // Wait to start loading.
    await page.waitForSelector('.ant-spin', {hidden: true}); // Wait to finish loading.
  };

  beforeAll(async (done) => {
    page = await (await puppeteer.launch()).newPage();
    await login(page, 'admin', 'admin');
    done();
  });

  beforeEach(async (done) => {
    await Promise.all([
      page.goto('http://localhost:3000/#/'),
      page.waitForNavigation()
    ]);
    await Promise.all([
      page.goto('http://localhost:3000/#/datatypesManagement3'),
      page.waitForNavigation()
    ]);
    await page.waitForSelector(tableNotEmptySelector); // Wait until the data is loaded.
    done();
  });

  const takeScreenshot = async () => {
    await page.pdf({path: './debug-screenshot.pdf'});
  };

  it('No filters applied', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    const table = await readTable();
    expect(table.length).toEqual(4);
    expect(table[0][columnIndex]).toEqual(inDiv('0'));
    expect(table[1][columnIndex]).toEqual(inDiv('-8273729824.34'));
    expect(table[2][columnIndex]).toEqual(inDiv('9131354156.12'));
    expect(table[3][columnIndex]).toEqual(inDiv(''));
    done();
  });

  it('BigDecimal field - "equals" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'equals');
    await setInputValue(attr, '9131354156.12');
    await applyFilter();
    const table = await readTable();
    expect(table.length).toEqual(1);
    expect(table[0][columnIndex]).toEqual(inDiv('9131354156.12'));
    done();
  });

  it('BigDecimal field - "greater than" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'greater');
    await setInputValue(attr, '0');
    await applyFilter();
    const table = await readTable();
    expect(table.length).toEqual(1);
    expect(table[0][columnIndex]).toEqual(inDiv('9131354156.12'));
    done();
  });

  it('BigDecimal field - "greater than or equal" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'greaterOrEqual');
    await setInputValue(attr, '0');
    await applyFilter();
    const table = await readTable();
    expect(table.length).toEqual(2);
    expect(table[0][columnIndex]).toEqual(inDiv('0'));
    expect(table[1][columnIndex]).toEqual(inDiv('9131354156.12'));
    done();
  });

  it('BigDecimal field - "less than" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'less');
    await setInputValue(attr, '0');
    await applyFilter();
    const table = await readTable();
    expect(table.length).toEqual(1);
    expect(table[0][columnIndex]).toEqual(inDiv('-8273729824.34'));
    done();
  });

  it('BigDecimal field - "less than or equal" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'lessOrEqual');
    await setInputValue(attr, '0');
    await applyFilter();
    const table = await readTable();
    expect(table.length).toEqual(2);
    expect(table[0][columnIndex]).toEqual(inDiv('0'));
    expect(table[1][columnIndex]).toEqual(inDiv('-8273729824.34'));
    done();
  });

  it('BigDecimal field - "not equal" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'notEqual');
    await setInputValue(attr, '0');
    await takeScreenshot();
    await applyFilter();
    const table = await readTable();
    expect(table.length).toEqual(2);
    expect(table[0][columnIndex]).toEqual(inDiv('-8273729824.34'));
    expect(table[1][columnIndex]).toEqual(inDiv('9131354156.12'));
    done();
  });

  it('BigDecimal field - "is set" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'notEmpty');
    await setSelectValue(attr, 'true');
    await applyFilter();
    const table = await readTable();
    expect(table.length).toEqual(3);
    expect(table[0][columnIndex]).toEqual(inDiv('0'));
    expect(table[1][columnIndex]).toEqual(inDiv('-8273729824.34'));
    expect(table[2][columnIndex]).toEqual(inDiv('9131354156.12'));
    done();
  });

  // TODO Enable once https://github.com/cuba-platform/frontend/issues/124 is fixed
  // it('BigDecimal field - "is not set" filter', async () => {
  //   const columnIndex = 0;
  //   const attr = 'bigDecimalAttr';
  //
  //   await openFilter(columnIndex);
  //   await setOperator(attr, 'notEmpty');
  //   await setSelectValue(attr, 'false');
  //   await applyFilter();
  //   const table = await readTable();
  //   expect(table.length).toEqual(1);
  //   expect(table[0][columnIndex]).toEqual(inDiv(''));
  // });

  it('BigDecimal field - "in" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'in');
    await addListItem(attr, '-8273729824.34');
    await addListItem(attr, '9131354156.12');
    await applyFilter();

    const table = await readTable();
    expect(table.length).toEqual(2);
    expect(table[0][columnIndex]).toEqual(inDiv('-8273729824.34'));
    expect(table[1][columnIndex]).toEqual(inDiv('9131354156.12'));
    done();
  });

  it('BigDecimal field - "not in" filter', async (done) => {
    const columnIndex = 0;
    const attr = 'bigDecimalAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'notIn');
    await takeScreenshot();
    await addListItem(attr, '-8273729824.34');
    await addListItem(attr, '9131354156.12');
    await applyFilter();

    const table = await readTable();
    // TODO Expect 2 results instead 1 once https://github.com/cuba-platform/frontend/issues/122 is fixed
    // expect(table.length).toEqual(2);
    expect(table.length).toEqual(1);
    expect(table[0][columnIndex]).toEqual(inDiv('0'));
    // TODO Enable once https://github.com/cuba-platform/frontend/issues/122 is fixed
    // expect(table[1][columnIndex]).toEqual(inDiv(''));
    done();
  });

  it('Boolean field - "equals true" filter', async (done) => {
    const columnIndex = 1;
    const attr = 'booleanAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'equals');
    await setSelectValue(attr, 'true');
    await applyFilter();

    const table = await readTable();
    expect(table.length).toEqual(1);
    expect(table[0][columnIndex]).toEqual(checkboxOn);
    done();
  });

  it('Boolean field - "equals false" filter', async (done) => {
    const columnIndex = 1;
    const attr = 'booleanAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'equals');
    await setSelectValue(attr, 'false');
    await applyFilter();

    const table = await readTable();
    expect(table.length).toEqual(1);
    console.log(table[0][columnIndex]);
    expect(table[0][columnIndex]).toEqual(checkboxOff);
    done();
  });

  it('Boolean field - "not equals true" filter', async (done) => {
    const columnIndex = 1;
    const attr = 'booleanAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'notEquals');
    await setSelectValue(attr, 'true');
    await applyFilter();

    const table = await readTable();
    expect(table.length).toEqual(1);
    expect(table[0][columnIndex]).toEqual(checkboxOff);
    done();
  });

  it('Boolean field - "not equals false" filter', async (done) => {
    const columnIndex = 1;
    const attr = 'booleanAttr';

    await openFilter(columnIndex);
    await setOperator(attr, 'notEquals');
    await setSelectValue(attr, 'false');
    await applyFilter();

    const table = await readTable();
    expect(table.length).toEqual(1);
    expect(table[0][columnIndex]).toEqual(checkboxOn);
    done();
  });
});

const inDiv = (text) => `<div>${text}</div>`;

const checkboxOn = '<label class="ant-checkbox-wrapper ant-checkbox-wrapper-checked ant-checkbox-wrapper-disabled"><span class="ant-checkbox ant-checkbox-checked ant-checkbox-disabled"><input type="checkbox" disabled="" class="ant-checkbox-input" value="" checked=""><span class="ant-checkbox-inner"></span></span></label>';
const checkboxOff = '<label class="ant-checkbox-wrapper ant-checkbox-wrapper-disabled"><span class="ant-checkbox ant-checkbox-disabled"><input type="checkbox" disabled="" class="ant-checkbox-input" value=""><span class="ant-checkbox-inner"></span></span></label>';
