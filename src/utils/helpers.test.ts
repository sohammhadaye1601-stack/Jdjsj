import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPhoneNumber,
  formatWhatsAppLink,
  sanitizeInstagram,
  validateEnquiry,
  filterEnquiries,
} from './helpers';
import { Enquiry } from '../types';

test('formatPhoneNumber strips spaces and special chars', () => {
  assert.equal(formatPhoneNumber('98868 22368'), '9886822368');
  assert.equal(formatPhoneNumber('+91 76769 65555'), '+917676965555');
  assert.equal(formatPhoneNumber(''), '');
});

test('formatWhatsAppLink generates correct URL with 91 prefix and encoded message', () => {
  const link = formatWhatsAppLink('9886822368', 'Hi HR PRO FITNESS! I want to join.');
  assert.match(link, /^https:\/\/wa\.me\/919886822368\?text=/);
  assert.ok(link.includes('Hi%20HR%20PRO%20FITNESS'));
});

test('sanitizeInstagram handles with or without @ prefix', () => {
  const res1 = sanitizeInstagram('@hrprofitness');
  assert.equal(res1.handle, '@hrprofitness');
  assert.equal(res1.url, 'https://instagram.com/hrprofitness');

  const res2 = sanitizeInstagram('hrprofitness');
  assert.equal(res2.handle, '@hrprofitness');
  assert.equal(res2.url, 'https://instagram.com/hrprofitness');
});

test('validateEnquiry validates required fields correctly', () => {
  const invalid = validateEnquiry({ fullName: '', phone: '123', fitnessGoal: '' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.fitnessGoal);

  const valid = validateEnquiry({
    fullName: 'Rahul Sharma',
    phone: '9886822368',
    fitnessGoal: 'Muscle Building',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('filterEnquiries filters by status and search keyword', () => {
  const mockEnquiries: Enquiry[] = [
    {
      id: '1',
      fullName: 'Rahul Sharma',
      phone: '9886822368',
      fitnessGoal: 'Muscle Building',
      preferredProgram: 'Weight Training',
      message: 'Looking for morning batch',
      status: 'new',
      createdAt: '2026-01-01T10:00:00.000Z',
    },
    {
      id: '2',
      fullName: 'Anita Desai',
      phone: '7676965555',
      fitnessGoal: 'Fat Loss',
      preferredProgram: 'Weight Loss',
      message: 'Need evening coach',
      status: 'contacted',
      createdAt: '2026-01-02T10:00:00.000Z',
    },
  ];

  const newOnly = filterEnquiries(mockEnquiries, 'new');
  assert.equal(newOnly.length, 1);
  assert.equal(newOnly[0].fullName, 'Rahul Sharma');

  const searchResults = filterEnquiries(mockEnquiries, 'all', 'Anita');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].fullName, 'Anita Desai');
});
