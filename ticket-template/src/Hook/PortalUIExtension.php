<?php

namespace HomeUser\iTop\Extension\Hook;

use AbstractPortalUIExtension;
use Symfony\Component\DependencyInjection\Container;
use utils;

class PortalUIExtension extends AbstractPortalUIExtension
{
	public function GetJSFiles(Container $oContainer)
	{
		return array(
			utils::GetAbsoluteUrlModulesRoot() . 'ticket-template/assets/js/portal-ticket-template.js',
		);
	}
}
