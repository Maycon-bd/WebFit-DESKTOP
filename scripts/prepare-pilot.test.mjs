import test from 'node:test';
import assert from 'node:assert/strict';
import { pilotVersion, newerPilot } from './prepare-pilot.mjs';

test('unique pilot version exceeds manual bootstrap and separates reruns',()=>{
  assert.equal(pilotVersion('0.1.5',12,1),'0.1.6-pilot.12.1');
  assert.notEqual(pilotVersion('0.1.5',12,1),pilotVersion('0.1.5',12,2));
  assert.throws(()=>pilotVersion('0.1.5-pilot.1.1',12,1));
  assert.throws(()=>pilotVersion('0.1.5',0,1));
});

test('publication refuses downgrade or repeated version, using numeric pilot order',()=>{
  assert.equal(newerPilot('0.1.6-pilot.10.1','0.1.6-pilot.9.2'),true);
  assert.equal(newerPilot('0.1.6-pilot.10.1','0.1.6-pilot.10.1'),false);
  assert.equal(newerPilot('0.1.5-pilot.99.1','0.1.6-pilot.1.1'),false);
  assert.throws(()=>newerPilot('0.1.6-pilot.1.1','unexpected'));
});
