<?php

namespace AppBundle\Entity;

use AppBundle\Utils\Traits\EntityDateTimes;
use Doctrine\ORM\Mapping as ORM;

/**
 * WsMessage
 *
 * @ORM\Table(name="ws_message")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\WsMessageRepository")
 */
class WsMessage
{
	use EntityDateTimes;
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="value", type="string", length=500)
     */
    private $value;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     *
     * @param string $value
	 */
    public function setValue($value)
    {
        $this->value = $value;
    }

    /**
     * Get value
     *
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }
}

