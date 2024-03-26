from odoo import models, fields, api


class HrAttendance(models.Model):
    _inherit = 'hr.attendance'

    project_id = fields.Many2one('project.project')
    task_id = fields.Many2one(
        'project.task', domain="[('project_id', '=', project_id)]")
    description = fields.Text('Description')

    @api.onchange('project_id')
    def _onchange_project_id(self):
        """Prevent tasks from another project"""
        self.task_id = None
