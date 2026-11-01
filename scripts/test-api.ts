import assert from "assert";
import { DataStore } from "../src/lib/data-store";

async function runTests() {
  console.log("=========================================");
  console.log("RUNNING RESOURCEHUB QA AUTOMATED TEST SUITE");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`❌ [FAIL] ${name}`);
      console.error(e);
      failed++;
    }
  }

  // 1. Resources Query
  test("1. Fetch all catalog resources", () => {
    const list = DataStore.getResources();
    assert(list.length >= 10, "Should have at least 10 seed resources across categories");
  });

  // 2. Filter by Category
  test("2. Filter resources by category '3D printers'", () => {
    const list = DataStore.getResources({ category: "3D printers" });
    assert(list.length >= 1, "Should find 3D printers");
    assert(list.every(r => r.category === "3D printers"), "All results must match category");
  });

  // 3. Search Filter
  test("3. Search resources by keyword 'NVIDIA'", () => {
    const list = DataStore.getResources({ search: "NVIDIA" });
    assert(list.length >= 1, "Should find DGX server");
    assert(list[0].name.includes("NVIDIA"), "Result name should contain NVIDIA");
  });

  // 4. Overlap Conflict Prevention Test
  test("4. Server-side overlap detection prevents double booking", () => {
    const resourceId = "33333333-3333-3333-3333-333333333301";
    
    // First, create booking A
    const resA = DataStore.createBooking({
      resource_id: resourceId,
      user_id: "22222222-2222-2222-2222-222222222221",
      start_time: "2026-11-20T10:00:00Z",
      end_time: "2026-11-20T13:00:00Z",
      purpose: "Automated Test Booking A",
    });
    assert(resA.success && resA.booking, "Booking A creation should succeed");

    // Approve booking A
    const appA = DataStore.approveBooking(resA.booking.id);
    assert(appA.success, "Booking A approval should succeed");

    // Attempt overlapping booking B: 11:00 to 14:00 (overlaps with 10:00 - 13:00)
    const resB = DataStore.createBooking({
      resource_id: resourceId,
      user_id: "22222222-2222-2222-2222-222222222221",
      start_time: "2026-11-20T11:00:00Z",
      end_time: "2026-11-20T14:00:00Z",
      purpose: "Conflicting Overlapping Booking B",
    });

    assert(!resB.success, "Overlapping booking request MUST be rejected by server");
    assert(resB.error?.includes("already booked"), "Error message should mention already booked slot");
  });

  // 5. Booking Duration Limit Test
  test("5. Duration limit enforcement", () => {
    const resource = DataStore.getResources()[0];
    const excessiveHours = resource.max_duration_hours + 5;
    
    const start = new Date("2026-11-25T10:00:00Z");
    const end = new Date(start.getTime() + excessiveHours * 60 * 60 * 1000);

    const res = DataStore.createBooking({
      resource_id: resource.id,
      user_id: "22222222-2222-2222-2222-222222222221",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      purpose: "Excessive Duration Test",
    });

    assert(!res.success, "Booking exceeding max duration must be rejected");
    assert(res.error?.includes("exceeds maximum permitted limit"), "Error should explain duration limit");
  });

  // 6. Check-In & Check-Out Workflow
  test("6. Full Check-In -> Check-Out -> Condition Report lifecycle", () => {
    const resource = DataStore.getResources()[1];
    
    // Create new booking
    const bRes = DataStore.createBooking({
      resource_id: resource.id,
      user_id: "22222222-2222-2222-2222-222222222221",
      start_time: "2026-12-01T10:00:00Z",
      end_time: "2026-12-01T12:00:00Z",
      purpose: "Workflow Test",
    });
    assert(bRes.success && bRes.booking);
    const booking = bRes.booking;

    // Approve
    const app = DataStore.approveBooking(booking.id);
    assert(app.success && app.booking);
    assert.strictEqual(app.booking.status, "Approved");

    // Check-In
    const ci = DataStore.checkInBooking(booking.id);
    assert(ci.success && ci.booking);
    assert.strictEqual(ci.booking.status, "Checked Out");
    assert(ci.booking.check_in_time !== null);

    // Check-Out with condition audit
    const co = DataStore.checkOutBooking(booking.id, {
      condition_rating: "Excellent",
      checklist: {
        cleanliness: true,
        cables_intact: true,
        functional_test_passed: true,
        accessories_returned: true,
      },
      notes: "Cleaned and verified.",
    });
    assert(co.success && co.booking);
    assert.strictEqual(co.booking.status, "Returned");
    assert(co.booking.check_out_time !== null);

    // Verify condition report created
    const crs = DataStore.getConditionReports(resource.id);
    assert(crs.some(r => r.booking_id === booking.id));
  });

  // 7. Notification Delivery
  test("7. In-app notifications generated upon booking events", () => {
    const notifs = DataStore.getNotifications("22222222-2222-2222-2222-222222222221");
    assert(notifs.length > 0, "Student should have received notifications");
  });

  // 8. Analytics Calculation
  test("8. Utilization analytics calculates dynamic rates correctly", () => {
    const metrics = DataStore.getAnalytics();
    assert(metrics.totalResources >= 10);
    assert(metrics.overallUtilizationRate > 0 && metrics.overallUtilizationRate <= 100);
    assert(metrics.categoryBreakdown.length > 0);
    assert(metrics.monthlyTrends.length > 0);
  });

  console.log("\n=========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=========================================\n");

  if (failed > 0) process.exit(1);
}

runTests();
