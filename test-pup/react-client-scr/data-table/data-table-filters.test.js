const {login} = require("../../common/login-to-scr");
const puppeteer = require("puppeteer");

describe('DataTable - filters', () => {
 let page;

 const anyRowSelector = 'tr.ant-table-row.ant-table-row-level-0';

  /**
   *
   * @returns {!Promise<!Object|undefined>} a promise that resolves into a 2D array
   * (array of rows, row is an array of cells).
   * To get a cell use `table[rowIndex][columnIndex]`.
   */
  const readTable = async () => {
    return page.$$eval('.ant-table-tbody > tr', rows => {
      return rows.map(row => {
        console.log('row', row);
        const cells = [...row.getElementsByTagName('td')].slice(1); // Slice away the selection column.
        return cells.map(cell => {
          return cell.innerHTML;
        });
      });
    });
  };

  const openFilter = async (columnIndex) => {
    const filterSelector = `.ant-table-thead > tr:nth-child(${columnIndex + 1}) i`;
    await page.click(filterSelector);
    await page.waitForSelector('.cuba-filter-controls-layout');
  };

  const setValue = async (value) => {
    const inputSelector = '.cuba-filter-controls-layout:nth-child(2) input';
    await page.type(inputSelector, value);
  };

  const submit = async () => {
    const submitBtnSelector = '.cuba-table-filter > .footer > button[type="submit"]';
    await page.click(submitBtnSelector);
    await page.waitForSelector(anyRowSelector, {hidden: true});
    await page.waitForSelector(anyRowSelector);
  };

  beforeAll(async () => {
    page = await (await puppeteer.launch()).newPage();
    await login(page, 'admin', 'admin');
  });

  beforeEach(async () => {
    await page.goto('http://localhost:3000/#/datatypesManagement3');
    // Wait until the data is loaded.
    await page.waitForSelector(anyRowSelector);
  });

 it('BigDecimal field', async () => {
   const columnIndex = 0;

   const table = await readTable();
   expect(table.length).toEqual(4);
   expect(table[0][columnIndex]).toEqual(inDiv('0'));
   expect(table[1][columnIndex]).toEqual(inDiv('-8273729824.34'));
   expect(table[2][columnIndex]).toEqual(inDiv('9131354156.12'));
   expect(table[3][columnIndex]).toEqual(inDiv(''));

   await openFilter(columnIndex);
   await setValue('9131354156.12');
   await submit();

   expect(table.length).toEqual(4);
   expect(table[0][columnIndex]).toEqual('9131354156.12');
 });
});

const inDiv = (text) => `<div>${text}</div>`;
