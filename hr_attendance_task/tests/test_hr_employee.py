from odoo.tests.common import TransactionCase


class HrEmployeeTest(TransactionCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.employee = cls.env['hr.employee'].create({
            'name': 'Test Employee',
        })
        cls.project_id = cls.env['project.project'].create({
            'name': 'Test Project',
        })
        cls.task_id = cls.env['project.task'].create({
            'name': 'Test Task',
            'project_id': cls.project_id.id,
        })
        cls.description = 'Test description'

    def test_attendance_action_change(self):
        attendance_action = self.employee._attendance_action_change(
            geo_information=None,
            project_id=self.project_id.id,
            task_id=self.task_id.id,
            description=self.description
        )

        self.assertEqual(attendance_action.project_id, self.project_id)
        self.assertEqual(attendance_action.task_id, self.task_id)
        self.assertEqual(attendance_action.description, self.description)
