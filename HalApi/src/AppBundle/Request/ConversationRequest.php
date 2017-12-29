<?php

namespace AppBundle\Request;

use Symfony\Component\Validator\Constraints as Assert;


/**
 * Class ConversationRequest
 * @package AppBundle\Request
 */
class ConversationRequest
{
	/**
	 * @var string
	 * @Assert\NotNull()
	 */
	public $sentenceA;

	/**
	 * @var string
	 * @Assert\NotNull()
	 */
	public $sentenceB;


}