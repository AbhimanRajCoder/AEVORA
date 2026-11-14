import test from 'node:test';
import assert from 'node:assert/strict';
import {missionDraft} from '../validators/missionValidator.js';
const draft = {title:' Orientation ',brief:'Campus induction',due_on:'2028-02-29',tasks:[' Read map ']};
test('normalizes published tasks and accepts leap days',()=>{
  assert.deepEqual(missionDraft(draft),{...draft,title:'Orientation',tasks:['Read map']});
});
test('rejects invalid deadlines and incomplete task lists',()=>{
  for (const change of [{due_on:'2027-02-29'},{tasks:[]},{tasks:[' ']},{tasks:Array(13).fill('Check')},{title:''}])
    assert.throws(()=>missionDraft({...draft,...change}),e=>e.statusCode===400);
});
