<?php

namespace AppBundle\Request;

use Symfony\Component\Validator\Constraints as Assert;

class SpeechCommandRequest
{
	/**
	 * @var string
	 * @Assert\NotNull()
	 */
	public $command;

	/**
	 * @var array
	 * @Assert\Type("array")
	 */
	public $wsMessages;

	/**
	 * @var int
	 * @Assert\NotNull()
	 */
	public $languageId;
}