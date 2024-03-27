from odoo import models, fields, api


class HrEmployee(models.Model):
    _inherit = 'hr.employee'

    # -------------------------------------------------------------------------
    # OVERRIDE
    # -------------------------------------------------------------------------
    def _attendance_action_change(self, project_id=None, task_id=None, description=None, geo_information=None):
        """Inherited to add additional data."""
        """
        Modifies the attendance to add additional data.
        
        :param project_id:  Project record.
        :type project_id:   :class:`project.project`
        :param task_id:     Task record.
        :type task_id:      :class:`project.task`
        :param description: A description associated with the attendance.
        :type task_id:      str
        
        :return:            The modified attendance action including
                            the additional data.
        :rtype:             dict
        """
        attendance = super()._attendance_action_change(geo_information)
        attendance.update({
            'project_id': project_id,
            'task_id': task_id,
            'description': description,
        })

        return attendance
