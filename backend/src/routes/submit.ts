import { Router, Request, Response } from 'express';
import { db } from '../db/client';
import { udyamRegistrations } from '../db/schema';
import { validateSubmitData } from '../validation/rules';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/submit', async (req: Request, res: Response) => {
  try {
    const data = req.body;

    // Validate the data
    const validation = validateSubmitData(data);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Check for duplicate Aadhaar number
    const existingRegistration = await db
      .select()
      .from(udyamRegistrations)
      .where(eq(udyamRegistrations.aadhaarNumber, data.aadhaar_number))
      .limit(1);

    if (existingRegistration.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'A registration with this Aadhaar number already exists',
      });
    }

    // Insert the new registration
    const newRegistration = await db.insert(udyamRegistrations).values({
      aadhaarNumber: data.aadhaar_number,
      ownerName: data.owner_name,
      declaration: data.declaration,
      typeOfOrganisation: data.type_of_organisation,
      panNumber: data.pan_number || null,
    }).returning();

    return res.status(201).json({
      success: true,
      data: newRegistration[0],
    });
  } catch (error) {
    console.error('Error submitting registration:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;
