import {collectGenerators, generate} from "../init";
import * as assert from "assert";


describe('generator', function () {
  it('collectGenerators' , async function() {
    const generators = await collectGenerators();
    assert(Array.isArray(generators));
    console.log(generators.reduce((p, gen) => p+= gen.name + '\n', ''));
  });

  it('generates Polymer client', function () {
    return generate('polymer2', 'app');
  })
});