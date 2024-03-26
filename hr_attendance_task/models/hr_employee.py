from odoo import models, fields, api


class HrEmployee(models.Model):
    _inherit = 'hr.employee'

    # -------------------------------------------------------------------------
    # OVERRIDE
    # -------------------------------------------------------------------------
    def _attendance_action_change(self, project_id, task_id, description, geo_information=None):
        attendance = super()._attendance_action_change(geo_information)
        attendance.update({
            'project_id': project_id,
            'task_id': task_id,
            'description': description,
        })

        return attendance
