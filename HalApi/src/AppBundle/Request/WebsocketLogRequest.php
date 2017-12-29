<?php

namespace AppBundle\Request;

use Symfony\Component\Validator\Constraints as Assert;


class WebsocketLogRequest
{

	/**
	 * @var string
	 * @Assert\NotNull()
	 */
	public $from;

	/**
	 * @var string
	 * @Assert\NotNull()
	 */
	public $to;

	/**
	 * @var string
	 * @Assert\NotNull()
	 */
	public $data;

	/**
	 * @var string
	 * @Assert\NotNull()
	 */
	public $event;
}