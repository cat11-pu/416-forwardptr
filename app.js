// app.js：渲染结果
import { chaseOf, hopsOf, landedOf } from "./forward.js";
import { step, close } from "./forwardrun.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const deepest = function (state) {
    let best = 0;
    for (const row of state.reads) {
      if (row[2] > best) {
        best = row[2];
      }
    }
    return best;
  };
  const fingerprint = function (state) {
    return JSON.stringify({
      slots: state.slots, forwards: state.forwards, reads: state.reads,
      ledger: state.ledger, applied: state.applied.length
    });
  };
  return { slots: closed.state.slots.map(function (row) { return [row[0], row[1], row[2]]; }),
           forwards: closed.state.forwards.map(function (row) { return [row[0], row[1]]; }),
           reads: closed.state.reads.map(function (row) { return [row[0], row[1], row[2]]; }),
           deepest: deepest(closed.state),
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before, ledger: first.ledger,
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: chaseOf([[1, 3], [3, 4]], 1).length + hopsOf([[1, 3]], 1)
             + landedOf([[1, 3], [3, 4]], 1) };
}
